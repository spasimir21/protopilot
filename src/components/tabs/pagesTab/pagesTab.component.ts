import addPageModalComponent, { AddPageModalData } from './modals/addPageModal/addPageModal.component';
import modalComponent, { ModalController, provideModal } from '../../modal/modal.component';
import { Page, PageManager, getPageManager } from '../../../manager/PageManager';
import pageInfoComponent from './components/pageInfo/pageInfo.component';
import { Controller, Inject, UixComponent } from '@uixjs/core';
import defineComponent from './pagesTab.view.html';
import { State } from '@uixjs/reactivity';

class PagesTabController extends Controller {
  @State
  modalComponent: UixComponent;
  @State
  modal: ModalController;

  @Inject(getPageManager)
  pageManager: PageManager;

  init() {
    this.openModal = this.openModal.bind(this);
  }

  afterViewInit() {
    this.modal = this.modalComponent.controller as ModalController;
    provideModal(this.context, this.modal);
  }

  openModal(pageId?: string) {
    const modalData = this.modal.data.modal as AddPageModalData;

    if (pageId) {
      const page = this.pageManager.getPage(pageId) as Page;

      modalData.isEditing = true;
      modalData.pageId = pageId;
      modalData.pageName = page.name;
      modalData.pageRoute = page.route;
    } else {
      modalData.isEditing = false;
      modalData.pageId = null;
      modalData.pageName = '';
      modalData.pageRoute = '';
    }

    this.modal.isShown = true;
  }
}

const pagesTabComponent = defineComponent({
  name: 'pages-tab',
  controller: PagesTabController,
  dependencies: [modalComponent, addPageModalComponent, pageInfoComponent]
});

export default pagesTabComponent;
export { pagesTabComponent };
