(ns cogito.env
  (:require
   ["create-react-class" :as crc]
   #?@(:test []
       :cljs [[cogito.react-native-navigation-bridge :as rnnbridge]])))

(declare register-component)
(declare create-wrapper)

(defn register [key]
  (register-component key (create-wrapper key)))

(defn create-wrapper [key]
  (crc #js
        {:getInitialState
         (fn []
           #js {:key key
                :id 1})

         :render
         (fn [] (println "foo"))}))

#?(:test
   (defn register-component [key component])

   :default
   (defn register-component [key component]
     (rnnbridge/register-component key component)))
