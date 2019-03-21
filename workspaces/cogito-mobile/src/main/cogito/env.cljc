(ns cogito.env
  (:require #?@(:test []
                :cljs [[cogito.react-native-navigation-bridge :as rnnbridge]])))

(declare register-component)

(defn register [key]
  (register-component key nil))

#?(:test
   (defn register-component [key component]
     (println "register-component placeholder"))

   :default
   (defn register-component [key component]
     (rnnbridge/register-component key component)))
