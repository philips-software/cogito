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
       #js {:root #js
                   {:stack #js
                            {:children #js [#js
                                             {:component #js
                                                          {:name "Home"}}]
                             :options #js {:topBar #js {:visible "false"}}}}}))))
