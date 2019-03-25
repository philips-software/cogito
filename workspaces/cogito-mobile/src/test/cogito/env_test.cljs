(ns cogito.env-test
  (:require [cljs.test :refer (deftest is testing use-fixtures)]
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

      (use-fixtures :each
        {:before [(reset! register-component-call-count 0)
                  (reset! wrapper-def nil)
                  (register "Home")]}

        (testing "it calls register-component"
          (is (= 1 @register-component-call-count)))

        (testing "it gets an id"
          (let [getInitialState (-> @wrapper-def .-getInitialState)
                initialState (getInitialState)]
            (is (= 1 (-> initialState .-id)))))))))