import React from "react";
import { View, Text } from "react-native";

// Legacy stubs to avoid breaking imports after removing old components.
// These are lightweight placeholders — replace with final implementations in the new structure as needed.

const Wrapper = ({ children, name, style }) => (
  <View style={style} accessible accessibilityLabel={`stub-${name}`}>
    {children}
  </View>
);

export const TabBar = (props) => <Wrapper name="TabBar" {...props} />;
export const BookCard = (props) => <Wrapper name="BookCard" {...props} />;
export const FavoriteBookCard = (props) => <Wrapper name="FavoriteBookCard" {...props} />;
export const HeaderFavorite = (props) => <Wrapper name="HeaderFavorite" {...props} />;
export const NotificationHeader = (props) => <Wrapper name="NotificationHeader" {...props} />;
export const NotificationList = (props) => <Wrapper name="NotificationList" {...props} />;
export const NotificationCard = (props) => <Wrapper name="NotificationCard" {...props} />;
export const UserCard = (props) => <Wrapper name="UserCard" {...props} />;
export const StatsCards = (props) => <Wrapper name="StatsCards" {...props} />;
export const LoanCard = (props) => <Wrapper name="LoanCard" {...props} />;
export const InfoButtons = (props) => <Wrapper name="InfoButtons" {...props} />;
export const AlertCard = (props) => <Wrapper name="AlertCard" {...props} />;
export const CustomAlert = (props) => (
  <View accessible accessibilityLabel="stub-CustomAlert">
    {props.children || <Text>{props.message || ""}</Text>}
  </View>
);

export const Header = (props) => <Wrapper name="Header" {...props} />;

export const TagBar = (props) => <Wrapper name="TagBar" {...props} />;
export const HomeHeader = (props) => <Wrapper name="HomeHeader" {...props} />;
export const SearchBarWithFilter = (props) => <Wrapper name="SearchBarWithFilter" {...props} />;
export const SectionHeader = (props) => (
  <View>
    <Text>{props.title || ""}</Text>
  </View>
);
export const DrawerMenu = (props) => <Wrapper name="DrawerMenu" {...props} />;

// Book details stubs
export const HeaderDetalhes = (props) => <Wrapper name="HeaderDetalhes" {...props} />;
export const CoverImage = (props) => <Wrapper name="CoverImage" {...props} />;
export const AvailabilityBadge = (props) => <Wrapper name="AvailabilityBadge" {...props} />;
export const InfoRowCards = (props) => <Wrapper name="InfoRowCards" {...props} />;
export const DetailsCard = (props) => <Wrapper name="DetailsCard" {...props} />;
export const AboutSection = (props) => <Wrapper name="AboutSection" {...props} />;
export const ReserveButton = (props) => <Wrapper name="ReserveButton" {...props} />;

export default {};
