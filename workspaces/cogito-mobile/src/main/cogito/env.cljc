(ns cogito.env
  (:require
   ["create-react-class" :as crc]
   #?@(:test []
       :cljs [[cogito.react-native-navigation-bridge :as rnnbridge]])))

(declare register-component)
(declare create-wrapper)

(defonce id-seq-ref (atom 0))
(defonce mounted-ref (atom {}))

(defn register [key]
  (register-component key (create-wrapper key)))

(defn create-wrapper [key]
  (crc #js
        {:getInitialState
         (fn []
           #js {:key key
                :id (swap! id-seq-ref inc)})

         :componentDidMount
         (fn [] (swap! mounted-ref
                       assoc-in [key] "foo"))

         :render
         (fn [] (println "TODO: render"))}))

#?(:test
   (defn register-component [key component])

   :default
   (defn register-component [key component]
     (rnnbridge/register-component key component)))
