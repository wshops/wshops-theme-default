import { Alpine as AlpineType } from 'alpinejs'
import { Notify } from './utils/notify'

declare global {
  interface Window {
    Alpine: AlpineType

    $notify: Notify;
  }
}

