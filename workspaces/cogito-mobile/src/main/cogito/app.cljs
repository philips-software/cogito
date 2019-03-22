(ns cogito.app
  (:require
   [reagent.core :as r :refer [atom]]
   ["react-native" :as ReactNative]
   ["react-native-navigation" :as ReactNativeNavigation :refer (Navigation)]
   [cogito.env :as env]))

(defn init []
  (env/register "Home")

  (let [events (.events Navigation)]
    (.registerAppLaunchedListener
     events
     #(.setRoot
       Navigation
       (cl->js {:root
                {:stack
                 {:children [{:component
                              {:name "Home"}}]
                  :options {:topBar {:visible "false"}}}}})))))
