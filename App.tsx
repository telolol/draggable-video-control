import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PlayerContainer } from './components/Player';


export default function App() {
  return (
    <GestureHandlerRootView>
      <PlayerContainer />
    </GestureHandlerRootView >
  );
}
