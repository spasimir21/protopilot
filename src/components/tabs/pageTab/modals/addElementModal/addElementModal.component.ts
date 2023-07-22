import { ModalController, getModal } from '../../../../modal/modal.component';
import defineComponent from './addElementModal.view.html';
import { ElementItem, ElementType } from '../../Item';
import { createElementItem } from '../../Element';
import { Controller, Export } from '@uixjs/core';

interface AddElementModalData {
  parentElement: ElementItem | null;
}

class AddElementModalController extends Controller<{}, { data: AddElementModalData }> {
  @Export
  data: AddElementModalData = {
    parentElement: null
  };

  modal: ModalController;

  onFirstMount() {
    this.modal = getModal(this.context);
  }

  addElement(type: ElementType) {
    if (this.data.parentElement == null) {
      this.modal.isShown = false;
      return;
    }

    const parentElement = this.data.parentElement;

    if (parentElement.children == null) parentElement.children = [];

    parentElement.children.push(createElementItem(type, this.context));

    this.data.parentElement = null;
    this.modal.isShown = false;
  }
}

const addElementModalComponent = defineComponent({
  name: 'add-element-modal',
  controller: AddElementModalController
});

export default addElementModalComponent;
export { addElementModalComponent };
