(ns cogito.env-test
  (:require [cljs.test :refer (deftest is testing)]
            ["create-react-class" :as crc]
            [cogito.env :refer (register register-component)]))

(deftest register-test
  (let [register-component-call-count (atom 0)
        crc-arg (atom nil)]
    (with-redefs [register-component
                  (fn [key wrapperFn]
                    (swap! register-component-call-count inc))

                  crc
                  (fn [js-struct] (reset! crc-arg js-struct))]

      (testing "it calls register-component"
        (register "Home")
        (is (= 1 @register-component-call-count))))))