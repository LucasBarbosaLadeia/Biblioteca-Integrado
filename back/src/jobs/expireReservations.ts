import Reserva from "../models/Reserva";
import Livro from "../models/Livro";
import sequelize from "../config/database";
import { Op } from "sequelize";

/**
 * Expira reservas cuja `data_expiracao` já passou.
 * Para cada reserva expirada: marca `status = 'expirada'` e repõe `Livro.qt_atual`.
 */
export async function expireReservations(): Promise<{
  expired: number;
  expiredIds?: number[];
  failed?: { id: number; reason: any }[];
}> {
  const start = Date.now();
  const now = new Date();
  console.log("\n=== expireReservations job starting ===");
  console.log("start:", new Date(start).toISOString());
  console.log("now:", now.toISOString());

  // buscar reservas ativas expiradas (usar Op.lt para compatibilidade)
  const expiredList = await Reserva.findAll({
    where: {
      status: "ativa",
      data_expiracao: { [Op.lt]: now },
    },
  });

  console.log(`candidates found: ${expiredList.length}`);
  if (expiredList.length > 0) {
    // mostrar alguns detalhes (até 20) para inspeção rápida
    const sample = expiredList.slice(0, 20).map((r) => ({
      id_reserva: r.id_reserva,
      id_usuario: r.id_usuario,
      id_livro: r.id_livro,
      data_expiracao: r.data_expiracao?.toISOString(),
      status: r.status,
    }));
    console.table(sample);
  }

  let count = 0;
  const expiredIds: number[] = [];
  const failed: { id: number; reason: any }[] = [];

  for (const reserva of expiredList) {
    console.log(
      `-> processing reserva id=${reserva.id_reserva} (livro=${
        reserva.id_livro
      }) exp=${reserva.data_expiracao?.toISOString()}`
    );
    try {
      await sequelize.transaction(async (t) => {
        // lock livro row
        const livro = await Livro.findByPk(reserva.id_livro, {
          transaction: t,
          lock: t.LOCK.UPDATE as any,
        });
        if (!livro) {
          // marcar reserva como expirada mesmo se livro não existir
          await reserva.update({ status: "expirada" }, { transaction: t });
          console.log(
            `   - reserva ${reserva.id_reserva} marked expirada (livro not found)`
          );
          expiredIds.push(reserva.id_reserva);
          return;
        }

        await reserva.update({ status: "expirada" }, { transaction: t });
        await livro.update(
          { qt_atual: livro.qt_atual + 1 },
          { transaction: t }
        );
        count += 1;
        expiredIds.push(reserva.id_reserva);
        console.log(
          `   - reserva ${reserva.id_reserva} expired, livro ${
            livro.id_livro
          } qt_atual -> ${livro.qt_atual + 1}`
        );
      });
    } catch (err) {
      console.error(
        `   ! error processing reserva id=${reserva.id_reserva}:`,
        err
      );
      failed.push({ id: reserva.id_reserva, reason: err });
    }
  }

  const elapsedMs = Date.now() - start;
  console.log("=== expireReservations summary ===");
  console.log(`total candidates: ${expiredList.length}`);
  console.log(`expired applied: ${count}`);
  console.log(`failed: ${failed.length}`);
  if (expiredIds.length) console.log(`expired ids: ${expiredIds.join(", ")}`);
  if (failed.length)
    console.log(`failed ids: ${failed.map((f) => f.id).join(", ")}`);
  console.log(`duration: ${elapsedMs} ms`);
  console.log("=== job finished ===\n");

  return { expired: count, expiredIds, failed };
}

// Permitir execução direta via ts-node-dev (útil para testes)
if (require.main === module) {
  (async () => {
    try {
      const res = await expireReservations();
      console.log(`Reservas expiradas: ${res.expired}`);
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
