# Guia rápido do StyleSheet (React Native)

Este README reúne os “comandos” (propriedades) e padrões mais usados do `StyleSheet` no React Native, com exemplos práticos para você estilizar telas e componentes do app.

## O que é o StyleSheet?

`StyleSheet` é a API do React Native para definir estilos em JavaScript, de forma semelhante ao CSS, porém com um conjunto próprio de propriedades e valores.

## Uso básico

```jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Exemplo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, mundo!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
});
```

---

## Propriedades mais comuns (cheat sheet)

- Layout/Flexbox

  - `flex`, `flexGrow`, `flexShrink`, `flexBasis`
  - `flexDirection` ('row' | 'column')
  - `justifyContent` ('flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly')
  - `alignItems` ('flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline')
  - `alignSelf` (sobrepõe `alignItems` para um item)
  - `flexWrap` ('wrap' | 'nowrap')

- Espaçamento e Tamanho

  - `margin`, `marginHorizontal`, `marginVertical`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft`
  - `padding`, `paddingHorizontal`, `paddingVertical`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`
  - `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`
  - Observação: porcentagens como `'50%'` são suportadas em várias propriedades de layout/tamanho.

- Posição

  - `position` ('relative' | 'absolute')
  - `top`, `right`, `bottom`, `left`, `zIndex`

- Borda e Arredondamento

  - `borderWidth`, `borderColor`, `borderStyle` ('solid' | 'dotted' | 'dashed')
  - `borderRadius`
  - `borderTopLeftRadius`, `borderTopRightRadius`, `borderBottomLeftRadius`, `borderBottomRightRadius`

- Cores

  - `backgroundColor`, `color`
  - Aceita formatos: `#RRGGBB`, `#RRGGBBAA`, `rgb()`, `rgba()`

- Tipografia

  - `fontSize`, `fontWeight` ('100'–'900' | 'normal' | 'bold')
  - `fontFamily` (deve existir no app/sistema)
  - `lineHeight`, `letterSpacing`
  - `textAlign` ('auto' | 'left' | 'right' | 'center' | 'justify')
  - `textDecorationLine` ('none' | 'underline' | 'line-through' | 'underline line-through')
  - `textTransform` ('none' | 'uppercase' | 'lowercase' | 'capitalize')

- Imagens e Ícones (em estilos do Image)

  - `tintColor` (aplica cor a ícones/PNG monocromáticos)
  - `resizeMode` é prop do componente `<Image />` (não do style): 'cover' | 'contain' | 'stretch' | 'repeat' | 'center'

- Sombra
  - iOS: `shadowColor`, `shadowOffset`({ width, height }), `shadowOpacity`, `shadowRadius`
  - Android: `elevation`

---

## Utilitários úteis do StyleSheet

- `StyleSheet.create({ ... })`

  - Congela os objetos de estilo e possibilita pequenas otimizações de performance.

- `StyleSheet.hairlineWidth`

  - Espessura mínima visível para linhas/bordas (varia conforme a densidade de pixels).

- `StyleSheet.absoluteFillObject`

  - Objeto pronto: `{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }`
  - Útil para overlays e fundos que ocupam toda a área do pai.

- `StyleSheet.flatten(style)`
  - Mescla arrays/objetos de estilo em um único objeto plano (útil em debug/composição dinâmica).

Exemplo com `absoluteFillObject`:

```jsx
<View style={{ flex: 1 }}>
  <Image source={bg} style={StyleSheet.absoluteFillObject} />
  <Text style={{ color: "#fff" }}>Conteúdo</Text>
</View>
```

---

## Estilos por plataforma e por tema

- Por plataforma:

```jsx
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  title: {
    fontSize: Platform.select({ ios: 18, android: 20, default: 18 }),
    color: Platform.OS === "android" ? "#222" : "#333",
  },
});
```

- Por dimensões/orientação:

```jsx
import { useWindowDimensions } from "react-native";

function Card() {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;

  return <View style={[styles.card, isSmall && styles.cardSmall]} />;
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12 },
  cardSmall: { padding: 12 },
});
```

- Composição e estilo condicional:

```jsx
<View
  style={[
    styles.base,
    isActive && styles.active,
    { opacity: disabled ? 0.5 : 1 },
  ]}
/>
```

---

## Exemplos práticos

- Lista em linha (como cards de livros):

```jsx
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12, // Se não estiver disponível na sua versão, use marginRight entre itens
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#666",
  },
});
```

- Botão com sombra (Android/iOS):

```jsx
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2B59C3",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    // Sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Sombra Android
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
```

---

## Boas práticas

- Prefira `StyleSheet.create` e reutilize estilos para reduzir re-renderizações.
- Use composição (`[style1, cond && style2, { inline }]`) para evitar duplicação.
- Centralize cores e dimensões recorrentes em um arquivo (ex.: `src/assets/theme.js`).
- Teste estilos em diferentes densidades e tamanhos de tela.
- Evite valores “mágicos”; nomeie estilos conforme a função (ex.: `card`, `title`, `tag`).

---

## Referência rápida (copiar/colar)

```jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  textTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  textMuted: {
    color: "#666",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
  },
  absoluteFill: StyleSheet.absoluteFillObject,
});
```

---

## Dúvidas rápidas

- “Tem `gap` igual ao CSS?” — Em versões recentes do RN, `gap` foi introduzido, mas nem todas as versões/targets suportam. Se não funcionar no seu app, substitua por `marginRight`/`marginBottom` entre itens.
- “Posso usar `%`?” — Em vários casos sim (largura/altura), mas prefira `flex` para layouts responsivos.
- “`resizeMode` no estilo?” — Não. É uma prop do `<Image />`.

---

Se quiser, posso adaptar este guia com exemplos reais dos componentes do projeto (ex.: `BookCard`, `HomeHeader`, `Botao`).
