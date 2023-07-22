import { ModalController, getModal } from '../../../../../../modal/modal.component';
import { PageData, getPageData } from '../../../../PageData';
import defineComponent from './explorerElements.view.html';
import { Controller, Inject } from '@uixjs/core';
import { ElementItem } from '../../../../Item';

class ExplorerElementsController extends Controller {
  @Inject(getPageData)
  pageData: PageData;

  modal: ModalController;

  init() {
    this.addChild = this.addChild.bind(this);
  }

  onFirstMount() {
    this.modal = getModal(this.context);
  }

  addChild(element: ElementItem) {
    this.modal.modalId = 'addElement';
    this.modal.data.addElement.parentElement = element;
    this.modal.isShown = true;
  }
}

const explorerElementsComponent = defineComponent({
  name: 'explorer-elements',
  controller: ExplorerElementsController
});

export default explorerElementsComponent;
export { explorerElementsComponent };
