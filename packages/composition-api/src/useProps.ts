import checkSetupEnv from './checkSetupEnv';
import ComponentSetup from './setup/ComponentSetup';
import { ComponentStore } from '@alipay/goldfish';
import { IProps } from '@alipay/goldfish-reactive-connect';

export default function useProps<P extends IProps>() {
  checkSetupEnv('useProps', ['component']);

  const setup = ComponentSetup.getCurrent<ComponentSetup>();
  const store = setup.getStoreInstance()! as ComponentStore<P>;

  return store.props;
}