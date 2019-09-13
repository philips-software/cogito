import RxDataSources

extension IdentityManagerViewController {
    struct ViewModel {
        // swiftlint:disable nesting

        struct FacetGroup: AnimatableSectionModelType, IdentifiableType, Equatable {
            typealias Identity = String
            typealias Item = Facet

            var identity = "only one"
            var items: [Facet]

            init(items: [Facet]) {
                self.items = items
            }

            init(original: FacetGroup, items: [Facet]) {
                self = original
                self.items = items
            }

            func sorted() -> FacetGroup {
                return FacetGroup(items: items.sorted(by: { (lhs, rhs) -> Bool in
                    guard let lhsFacet = lhs.facet else { return false }
                    guard let rhsFacet = rhs.facet else { return true }
                    return lhsFacet.created < rhsFacet.created
                }))
            }

            static func == (lhs: FacetGroup, rhs: FacetGroup) -> Bool {
                return lhs.items == rhs.items
            }
        }

        struct Facet: IdentifiableType, Equatable {
            static let placeHolder = Facet(facet: nil)

            typealias Identity = String?
            var identity: String? { return facet?.identifier.uuidString }
            var facet: CogitoIdentity?

            static func == (lhs: Facet, rhs: Facet) -> Bool {
                return lhs.facet == rhs.facet
            }
        }
    }
}
