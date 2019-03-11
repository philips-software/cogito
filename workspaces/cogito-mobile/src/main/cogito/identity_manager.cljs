(ns cogito.identity-manager
  (:require [reagent.core :as r :refer [atom]]
            [cogito.create-identity :as create-identity]))

(def ReactNative (js/require "react-native"))
(def view (r/adapt-react-class (.-View ReactNative)))
(def text (r/adapt-react-class (.-Text ReactNative)))

(def ReactNativeNavigation (js/require "react-native-navigation"))
(def navigation (.-Navigation ReactNativeNavigation))

(defn screen-layout []
  [view {:style {:flex-direction "column" :margin 40 :align-items "center" :background-color "white"}}
   [text {:style {:font-size 30 :font-weight "100" :margin-bottom 20 :text-align "center"}} "Identities"]])

(defn screen []
  (r/create-class
   {:display-name "identity-manager"

    :get-initial-state
    (fn [this]
      (println "get initial state")
      (let [events (.events navigation)]
        (.bindComponent events this)))

    :reagent-render screen-layout

    :navigation-button-pressed
    #(.showModal navigation create-identity/modal-presentation-layout)}))

(def push-options #js {:topBar #js {:visible "true"
                                    :title #js {:text "Me, myself and I"}
                                    :rightButtons #js [#js {:id "add" :systemItem "add"}]}})