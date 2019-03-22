(ns cogito.env
  (:require
   ["react-native" :as rn]
   ["react-native-navigation" :as rnn]
   ["create-react-class" :as crc]
   [reagent.core :as r]))

(defonce id-seq-ref (atom 0))
(defonce mounted-ref (atom {}))
(defonce screens-ref (atom {}))

(defn register [key]
  (let [get-props
        (fn [this]
          {::key key
           ::id (-> this .-state .-id)
           :component-id (-> this .-props .-componentId)})

        wrapper
        (crc #js
              {:getInitialState
               (fn []
                 #js {:key key
                      :id (swap! id-seq-ref inc)})

               :componentDidMount
               (fn []
                 (this-as ^js this
                          (-> (rnn/Navigation.events)
                              (.bindComponent this))

                          (swap! mounted-ref
                                 assoc-in [key (-> this .-state .-id)] this)))

               :componentWillUnmount
               (fn []
                 (this-as ^js this
                          (swap! mounted-ref
                                 update key dissoc (-> this .-state .-id))))


               ;; FIXME: forward other lifecycles the same way
               :navigationButtonPressed
               (fn []
                 (this-as this
                          (let
                           [{:keys [navigation-button-pressed]}
                            (get @screens-ref key)

                            props
                            (get-props this)]

                            (js/console.log "navigationButtonPressed"
                                            key
                                            (boolean navigation-button-pressed)
                                            (pr-str props))
                            (when navigation-button-pressed
                              (navigation-button-pressed props)))))

               :componentDidAppear
               (fn []
                 (this-as this
                          (js/console.log "componentDidAppear" key)))

               :componentDidDisappear
               (fn []
                 (this-as this
                          (js/console.log "componentDidDisappear" key)))

               :render
               (fn []
                 (this-as this
                          (let [{:keys [render]}
                                (get @screens-ref key)

                                props
                                (get-props this)]

                            (js/console.log "render" key (pr-str props))
                            (-> (render props)
                                (r/as-element)))))})]

    (rnn/Navigation.registerComponent key (fn [] wrapper))))

(defn reload {:dev/after-load true} []
  (doseq [[key instances] @mounted-ref
          [id inst] instances]
    (js/console.log "forceUpdate" key id)
    (.forceUpdate ^js inst)))

(defn add-screen [key screen-def]
  (swap! screens-ref assoc key screen-def))