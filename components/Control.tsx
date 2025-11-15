import { GlassView } from "expo-glass-effect";
import { SFSymbol, SymbolView } from "expo-symbols";
import { StyleSheet } from "react-native";

export const ControlButton = ({
  size,
  icon,
  rotate,
}: {
  size: number;
  icon: SFSymbol;
  rotate?: boolean;
}) => (
  <GlassView
    glassEffectStyle="clear"
    isInteractive
    style={[
      styles.controlButton,
      {
        width: size,
        height: size,
        borderRadius: size,
        transform: rotate ? [{ rotate: '90deg' }] : [],
      },
    ]}
  >
    <SymbolView
      name={icon}
      style={{ width: size * 0.4, height: size * 0.4 }}
      tintColor="white"
    />
  </GlassView>
);

const styles = StyleSheet.create({
  controlButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});