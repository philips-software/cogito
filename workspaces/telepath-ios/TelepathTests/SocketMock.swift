@testable import SocketIO

class SocketMock: SocketIOClient {
    var connected = false
    var lastEmittedEventName: String?
    var lastEmittedEventItems: [Any]?
    var ackNumber = 0
    var emitWithAckTimesOut = false
    var connectTriggersError: Error?

    func resetMock() {
        connected = false
        lastEmittedEventName = nil
        lastEmittedEventItems = nil
    }

    override func connect() {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            if let error = self.connectTriggersError {
                self.fakeError(error)
            } else {
                self.connected = true
                self.didConnect(toNamespace: "/")
            }
        }
    }

    override func disconnect() {
        connected = false
    }

    override func emit(_ event: String, _ items: SocketData..., completion: (() -> Void)?) {
        lastEmittedEventName = event
        lastEmittedEventItems = items
    }

    override func emitWithAck(_ event: String, _ items: SocketData...) -> OnAckCallback {
        lastEmittedEventName = event
        lastEmittedEventItems = items
        ackNumber += 1
        let onAck: OnAckCallback
        let items: [Any]
        if emitWithAckTimesOut {
            items = [SocketAckStatus.noAck.rawValue]
            onAck = OnAckCallback(ackNumber: ackNumber,
                                  items: items,
                                  socket: self,
                                  binary: false)
        } else {
            items = [event]
            onAck = OnAckCallback(ackNumber: ackNumber,
                                  items: items,
                                  socket: self,
                                  binary: false)
        }
        DispatchQueue.main.async { [weak self] in
            if let this = self {
                this.handleAck(this.ackNumber, data: items)
            }
        }
        return onAck
    }

    func fakeIncomingNotification(data: Data) {
        handlers
            .first(where: { $0.event == "notification" })?
            .executeCallback(with: [data], withAck: 0, withSocket: self)
    }

    func fakeError(_ error: Error) {
        DispatchQueue.main.async {
            self.handlers
                .first(where: { $0.event == "error" })?
                .executeCallback(with: [error], withAck: 0, withSocket: self)
        }
    }
}
