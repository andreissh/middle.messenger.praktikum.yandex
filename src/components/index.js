import { registerComponent } from "../framework/registerComponent.js";
import Link from "../components/btn/Link.js";
import LoginField from "../pages/home/components/login-field/LoginField.js";
import ChatItem from "../pages/chats/components/chat-item/ChatItem.js";
import ChatList from "../pages/chats/components/chat-list/ChatList.js";
import ProfileField from "../pages/profile/components/profile-field/ProfileField.js";
import ProfileFieldsList from "../pages/profile/components/profile-fields-list/ProfileFieldsList.js";

registerComponent("Link", Link);
registerComponent("LoginField", LoginField);
registerComponent("ChatItem", ChatItem);
registerComponent("ChatList", ChatList);
registerComponent("ProfileField", ProfileField);
registerComponent("ProfileFieldsList", ProfileFieldsList);
