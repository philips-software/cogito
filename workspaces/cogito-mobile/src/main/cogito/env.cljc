(ns cogito.env
  (:require
   ["create-react-class" :as crc]
   #?@(:test []
       :default [[cogito.react-native-navigation-bridge :as rnn-bridge]])
   [reagent.core :as r]))

(defonce id-seq-ref (atom 0))
(defonce mounted-ref (atom {}))
(defonce screens-ref (atom {}))

(defn reset-globals []
  (reset! id-seq-ref 0)
  (reset! mounted-ref {})
  (reset! screens-ref {}))

(declare register-component)
(declare bind-component)

(defn register [key]
  (let [get-props
        (fn [this]
          {::key key
           ::id (-> this .-state .-id)
           :component-id (-> this .-props .-componentId)})

        wrapper
        (crc #js
              {:getInitialState
               (let [id (swap! id-seq-ref inc)]
                 (fn []
                   #js {:key key
                        :id id}))

               :componentDidMount
               (fn []
                 (this-as ^js this
                          (bind-component this)

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

    (register-component key (fn [] wrapper))))

(defn reload {:dev/after-load true} []
  (doseq [[key instances] @mounted-ref
          [id inst] instances]
    (js/console.log "forceUpdate" key id)
    (.forceUpdate ^js inst)))

(defn add-screen [key screen-def]
  (swap! screens-ref assoc key screen-def))

#?(:test
   (defn register-component [key component] [])

   :default
   (defn register-component [key component]
     (rnn-bridge/register-component key component)))

#?(:test
   (defn bind-component [component] [])

   :default
   (defn bind-component [component]
     (rnn-bridge/bind-component component)))
