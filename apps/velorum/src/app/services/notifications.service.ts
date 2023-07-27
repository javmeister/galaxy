import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  public async walletClosedError() {
    return this.notify('Request Rejected', 'danger', 'fa-square-xmark', 6000);
  }

  public async registrationRequiredError() {
    return this.notify('Please register to be able to purchase.', 'danger', 'fa-square-xmark', 6000);
  }

  public async cantFindWalletWarning() {
    return this.notify("<strong>Can't find Wallet</strong><br />Please make sure it is installed in your browser.", 'warning', 'fa-square-exclamation', 6000);
  }

  public async walletConnectionRequestRejected() {
    return this.notify('<strong>Web3 Wallet</strong><br />Connection request rejected', 'danger', 'fa-square-xmark', 6000);
  }

  public async waitingToConfirmTransaction() {
    return this.notify('<strong>Transaction Created</strong><br />Please wait for network confirmation...', 'success', 'fa-square-check', 6000);
  }

  public async cantConfirmTransaction() {
    return this.notify("<strong>Can't confirm the Transaction</strong><br />please wait...", 'danger', 'fa-square-xmark', 6000);
  }

  public async transactionConfirmed() {
    return this.notify("<strong>Transaction confirmed</strong><br />Your items will be delivered in a few seconds...", 'success', 'fa-square-check', 6000);
  }

  public async MECOTransactionConfirmed() {
    return this.notify("<strong>Transaction confirmed</strong><br />You will get access to this Solar System in a few seconds...", 'success', 'fa-square-check', 6000);
  }

  public async walletAddressCopiedToClipboard(address: string) {
    return this.notify("<strong>Copied</strong><br />Your wallet address is now in the clipboard", 'success', 'fa-square-check', 6000);
  }




  private escapeHtml(html: string) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerHTML;
  }

  private notify(message: string, variant = 'primary', icon = 'fa-square-exclamation', duration = 3000) {
    const alert = Object.assign(document.createElement('sl-alert'), {
      variant,
      closable: true,
      duration: duration,
      className: 'velorum-toast',
      innerHTML: `
        <i class="fa-solid fa-fw ${icon} ${variant}" slot="icon"></i>
        ${this.escapeHtml(message)}
      `
    });

    document.body.append(alert);
    return alert.toast();
  }
}
