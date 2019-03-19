(ns cogito.env
  (:require #?@(:test []
                :cljs [[cogito.react-native-navigation-bridge :as rnnbridge]])))

#?(:test
   (defn register-component [key component]
     (println "register-component placeholder"))

   :default
   (defn register-component [key component]
     (rnnbridge/register-component key component)))

(defn register [key]
  (register-component key nil))
