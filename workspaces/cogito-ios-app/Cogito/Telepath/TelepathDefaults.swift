import Telepath

extension Telepath {
    init() {
        self.init(queuingServiceUrl: URL(string: "https://telepath.cogito.mobi")!)
    }
}
