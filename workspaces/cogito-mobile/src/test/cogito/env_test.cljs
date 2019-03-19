(ns cogito.env-test
  (:require [cljs.test :refer (deftest is testing)]
            [cogito.env :refer (register register-component)]))

(deftest register-test
  (testing "it calls register-component"
    (let [register-count (atom 0)]
      (with-redefs [register-component
                    (fn [key component]
                      (swap! register-count inc))]
        (register "Home")
        (is (= 1 @register-count))))))