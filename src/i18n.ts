import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {},
  },
  kr: {
    translation: {
      "Work out!": "Work out!",
      "Google Login": "Google 로그인",
      "Sign in": "로그인",
      "Sign up": "회원가입",
      ID: "아이디",
      Password: "비밀번호",
      "Check your password": "비밀번호 확인",
    },
  },
};

i18n
  // we pass the i18n instance to react-i18next which will
  // make it available for all the components via the context api.
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "kr", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;