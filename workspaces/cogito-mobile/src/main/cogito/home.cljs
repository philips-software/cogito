(ns cogito.home
  (:require
   [reagent.core :as r :refer [atom]]
   ["react-native" :as rn]
   ["react-native-navigation" :as rnn]
   [cogito.identity-manager :as identity-manager]
   [cogito.env :as env]))

(defn show-identity-manager [componentId]
  (rnn/Navigation.push
   componentId
   (clj->js
    {:component {:name "IdentityManager"
                 :options identity-manager/push-options}})))

(env/add-screen
 "Home"
 {:render
  (fn [{:keys [component-id] :as props}]
    [:> rn/View {:style {:flex-direction "column"
                         :margin 40
                         :align-items "center"}}

     [:> rn/Text {:style {:font-size 30
                          :font-weight "100"
                          :margin-bottom 20
                          :text-align "center"}}
      "Hi Shadow CLJS!"]

     [:> rn/Button {:title "Press me"
                    :on-press #(show-identity-manager component-id)}]])})
