import { Page, PageManager, getPageManager } from '../../../../../manager/PageManager';
import { ModalController, getModal } from '../../../../modal/modal.component';
import { Controller, Export, Inject } from '@uixjs/core';
import defineComponent from './addPageModal.view.html';

interface AddPageModalData {
  isEditing: boolean;
  pageId: string | null;
  pageName: string;
  pageRoute: string;
}

class AddPageModalController extends Controller<{}, { data: AddPageModalData }> {
  @Export
  data: AddPageModalData = {
    isEditing: false,
    pageId: null,
    pageName: '',
    pageRoute: ''
  };

  @Inject(getPageManager)
  pageManager: PageManager;

  submit() {
    if (this.data.pageName.trim().length == 0 || this.data.pageRoute.trim().length == 0) return;

    if (!this.data.isEditing) {
      this.pageManager.addPage({ name: this.data.pageName, route: this.data.pageRoute });
    } else {
      const page = this.pageManager.getPage(this.data.pageId as string) as Page;
      page.name = this.data.pageName;
      page.route = this.data.pageRoute;
    }

    getModal(this.context).isShown = false;
  }
}

const addPageModalComponent = defineComponent({
  name: 'add-page-modal',
  controller: AddPageModalController
});

export default addPageModalComponent;
export { addPageModalComponent, AddPageModalData };
