//  Copyright © 2017 Koninklijke Philips Nederland N.V. All rights reserved.

import Quick
import Nimble
import ReSwift
@testable import Cogito

class StorePersisterSpec: QuickSpec {
    override func spec() {
        var store: Store<AppState>!
        var url: URL!

        func deleteStore() {
            if FileManager.default.fileExists(atPath: url.path) {
                expect {
                    try FileManager.default.removeItem(at: url)
                    }.toNot(throwError())
            }
        }

        beforeEach {
            store = Store(reducer: {(_, _) in return initialAppState }, state: nil)
            let dir = NSSearchPathForDirectoriesInDomains(.cachesDirectory, .userDomainMask, true)[0]
            url = URL(fileURLWithPath: dir).appendingPathComponent("store.json")
            deleteStore()
        }

        afterEach {
            deleteStore()
        }

        it("can be constructed") {
            expect {
                try StorePersister(store: store, persistAt: url)
            }.toNot(throwError())
        }

        it("has a default instance") {
            let defaultPersister = StorePersister.default
            expect(defaultPersister).toNot(beNil())

            let path = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]
            expect(defaultPersister?.stateUrl.path) == path + "/state.json"
        }

        context("when file contains invalid JSON") {
            beforeEach {
                expect {
                    try "[invalid JSON}".data(using: .utf8)?.write(to: url)
                }.toNot(throwError())
            }

            it("throws") {
                expect { () -> Void in
                    _ = try StorePersister(store: store, persistAt: url)
                }.to(throwError())
            }
        }

        let validJSON = """
                {
                    "keyStore":{
                        "keyStore":{
                            "path":"some path",
                            "scryptN":1,
                            "scryptP":1
                        },
                        "keyStoreType":"KeyStore"
                    },
                    "geth": {},
                    "createIdentity": {
                        "description": ""
                    },
                    "diamond": {}
                }
                """
        context("when file contains valid JSON") {
            beforeEach {
                expect {
                    try validJSON.data(using: .utf8)?.write(to: url)
                }.toNot(throwError())
            }

            it("succeeds") {
                expect { () -> Void in
                    _ = try StorePersister(store: store, persistAt: url)
                }.toNot(throwError())
            }
        }

        context("given a started store persister") {
            var persister: StorePersister!

            beforeEach {
                expect { () -> Void in
                    try validJSON.data(using: .utf8)?.write(to: url)
                    persister = try StorePersister(store: store, persistAt: url)
                }.toNot(throwError())
            }

            it("does not save the state") {
                let newStore = KeyStore(path: "new path", scryptN: 2, scryptP: 2)
                store.state = appState(keyStore: KeyStoreState(keyStore: newStore))
                expect { () -> Void in
                    let savedContents = String(data: try Data(contentsOf: url), encoding: .utf8)
                    expect(savedContents).to(contain("some path"))
                    expect(savedContents).to(contain("\"scryptN\":1"))
                    expect(savedContents).to(contain("\"scryptP\":1"))
                }.toNot(throwError())
            }

            context("when started") {
                beforeEach {
                    persister.start()
                }

                it("saves the state when it changes") {
                    let newStore = KeyStore(path: "new path", scryptN: 2, scryptP: 2)
                    store.state = appState(keyStore: KeyStoreState(keyStore: newStore))
                    expect { () -> Void in
                        let savedContents = String(data: try Data(contentsOf: url), encoding: .utf8)
                        expect(savedContents).to(contain("new path"))
                        expect(savedContents).to(contain("\"scryptN\":2"))
                        expect(savedContents).to(contain("\"scryptP\":2"))
                    }.toNot(throwError())
                }

                context("when stopped") {
                    beforeEach {
                        persister.stop()
                    }

                    it("does not save the state") {
                        let newStore = KeyStore(path: "new path", scryptN: 3, scryptP: 3)
                        store.state = appState(keyStore: KeyStoreState(keyStore: newStore))
                        expect { () -> Void in
                            let savedContents = String(data: try Data(contentsOf: url), encoding: .utf8)
                            expect(savedContents).to(contain("some path"))
                            expect(savedContents).to(contain("\"scryptN\":1"))
                            expect(savedContents).to(contain("\"scryptP\":1"))
                        }.toNot(throwError())
                    }
                }
            }
        }
    }
}
