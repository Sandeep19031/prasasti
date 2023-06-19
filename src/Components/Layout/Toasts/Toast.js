import "react-notifications/lib/notifications.css";
import { NotificationManager } from "react-notifications";

// import {toast as toaster} from 'react-hot-toast';
class Toaster {
  success = (message) => {
    NotificationManager.success(message, "Success", 2000);
  };

  error = (message) => {
    NotificationManager.error(message, "Error", 2000);
  };

  info = (message) => {
    NotificationManager.info(message, "Info", 2000);
  };
}

export const toast = new Toaster();
