import { ComponentStore as BaseComponentStore, IProps } from '@goldfishjs/goldfish-reactive-connect';
import AppStore from './AppStore';

abstract class ComponentStore<P extends IProps, GS = AppStore> extends BaseComponentStore<P, GS> {

}

export default ComponentStore;
