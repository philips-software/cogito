(ns cogito.env-test
  (:require [cljs.test :refer (deftest is testing)]
            ["create-react-class" :as crc]
            [cogito.env :refer (register register-component)]))

(deftest register-test
  (let [register-component-call-count (atom 0)
        wrapper-def (atom nil)]
    (with-redefs [register-component
                  (fn [key wrapperFn]
                    (swap! register-component-call-count inc))

                  crc
                  (fn [js-struct] (reset! wrapper-def js-struct))]

      (testing "it calls register-component"
        (register "Home")
        (is (= 1 @register-component-call-count)))

      (testing "it gets an id"
        (register "Home")
        (let [getInitialState (-> @wrapper-def .-getInitialState)
              initialState (getInitialState)]
          (is (= 1 (-> initialState .-id))))))))