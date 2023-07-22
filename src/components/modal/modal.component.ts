import { Controller, Export, Shared, UixComponent, createContextValue } from '@uixjs/core';
import defineComponent from './modal.view.html';
import { Effect } from '@uixjs/reactivity';

class ModalController extends Controller<{}, { data: any }, { isShown: boolean; modalId: string }> {
  @Shared
  isShown: boolean;
  @Shared
  modalId: string;

  @Export
  data: Record<string, any> = {};

  init() {
    if (typeof this.isShown !== 'boolean') this.isShown = false;
    if (typeof this.modalId !== 'string') this.modalId = 'modal';
  }

  @Effect
  updateData() {
    for (const modalId in this.component.slots) {
      const element = this.component.slots[modalId];
      if (!(element instanceof UixComponent)) continue;
      this.data[modalId] = element.controller._exports.data;
    }
  }
}

const modalComponent = defineComponent({
  name: 'modal',
  controller: ModalController
});

const [provideModal, getModal] = createContextValue<ModalController>('modal');

export default modalComponent;
export { modalComponent, ModalController, provideModal, getModal };
