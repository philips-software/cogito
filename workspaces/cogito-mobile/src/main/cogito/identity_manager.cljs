(ns cogito.identity-manager
  (:require [reagent.core :as r :refer [atom]]
            ["react-native" :as ReactNative]
            ["react-native-navigation" :as ReactNativeNavigation :refer (Navigation)]
            [cogito.create-identity :as create-identity]))

(def view (r/adapt-react-class (.-View ReactNative)))
(def text (r/adapt-react-class (.-Text ReactNative)))

(defn screen-layout []
  [view {:style {:flex-direction "column"
                 :margin 40
                 :align-items "center"
                 :background-color "white"}}

   [text {:style {:font-size 30
                  :font-weight "100"
                  :margin-bottom 20
                  :text-align "center"}}
    "Identities"]])

(defn screen []
  (r/create-class
   {:display-name "identity-manager"

    :get-initial-state
    (fn [this]
      (println "get initial state")
      (let [events (.events Navigation)]
        (.bindComponent events this)))

    :reagent-render screen-layout

    :navigation-button-pressed
    #(.showModal Navigation create-identity/modal-presentation-layout)}))

(def push-options
  (clj->js {:topBar {:visible "true"
                     :title {:text "Me, myself and I"}
                     :rightButtons [{:id "add" :systemItem "add"}]}}))