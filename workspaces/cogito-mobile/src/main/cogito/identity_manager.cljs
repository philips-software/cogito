(ns cogito.identity-manager
  (:require
   [reagent.core :as r :refer [atom]]
   ["react-native" :as rn]
   ["react-native-navigation" :as ReactNativeNavigation :refer (Navigation)]
   [cogito.create-identity :as create-identity]
   [cogito.toolbar-button :as btn :refer [toolbar-button]]))

(defn screen-layout []
  [:> rn/View {:style {:flex-direction "column"
                       :margin 40
                       :align-items "center"}}

   [:> rn/Text {:style {:font-size 30
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
                     :rightButtons [(toolbar-button "add")]}}))