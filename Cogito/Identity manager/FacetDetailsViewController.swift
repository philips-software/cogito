//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import RxSwift
import RxCocoa
import RxDataSources
import JWTDecode

class FacetDetailsViewController: UITableViewController {
    var facet: Identity? {
        didSet {
            self.title = facet?.description
            createViewModel()
        }
    }

    var sections: [ViewModel.SectionModel] = []
    let disposeBag = DisposeBag()

    func createViewModel() {
        guard let facet = self.facet else {
            sections = []
            return
        }

        sections = [
            .facetDetailsSection(title: "Details", items: [
                .facetDetailItem(title: "Created:",
                                 detail: facet.created.description(with: Locale.autoupdatingCurrent)),
                .facetDetailItem(title: "Address:",
                                 detail: facet.address.description)
            ])
        ]
        for token in facet.idTokens {
            if let jwt = try? JWTDecode.decode(jwt: token) {
                var items = [ViewModel.SectionItem]()
                if let issuer = jwt.issuer {
                    items.append(.facetDetailItem(title: "Issuer:", detail: issuer))
                }
                if let subject = jwt.subject {
                    items.append(.facetDetailItem(title: "Subject:", detail: subject))
                }
                if let expiresAt = jwt.expiresAt {
                    items.append(.facetDetailItem(
                        title: "Expires at:",
                        detail: expiresAt.description(with: Locale.autoupdatingCurrent)))
                }
                if let audience = jwt.audience {
                    items.append(.facetDetailItem(title: "Audience:",
                                                  detail: audience.joined(separator: ", ")))
                }
                if items.count > 0 {
                    sections.append(.attestationsSection(title: "OpenID Attestation", items: items))
                }
            }
        }

        self.tableView.dataSource = nil

        let dataSource = RxTableViewSectionedReloadDataSource<ViewModel.SectionModel>(
            configureCell: { dataSource, table, indexPath, _ in
                switch dataSource[indexPath] {
                case let .facetDetailItem(title, detail):
                    let cell = table.dequeueReusableCell(withIdentifier: "Normal", for: indexPath)
                    cell.textLabel?.text = title
                    cell.detailTextLabel?.text = detail
                    cell.selectionStyle = .none
                    return cell
                }
            },
            titleForHeaderInSection: { dataSource, index in
                let section = dataSource[index]
                return section.title
            }
        )

        Observable.just(sections)
            .bind(to: tableView.rx.items(dataSource: dataSource))
            .disposed(by: disposeBag)
    }
}

extension FacetDetailsViewController {
    struct ViewModel {
        // swiftlint:disable nesting

        enum SectionModel {
            case facetDetailsSection(title: String, items: [SectionItem])
            case attestationsSection(title: String, items: [SectionItem])
        }

        enum SectionItem {
            case facetDetailItem(title: String, detail: String)
        }
    }
}

extension FacetDetailsViewController.ViewModel.SectionModel: SectionModelType {
    typealias Item = FacetDetailsViewController.ViewModel.SectionItem

    var title: String {
        switch self {
        case .facetDetailsSection(title: let title, items: _): return title
        case .attestationsSection(title: let title, items: _): return title
        }
    }

    var items: [FacetDetailsViewController.ViewModel.SectionItem] {
        switch self {
        case .facetDetailsSection(title: _, items: let items):
            return items.map { $0 }
        case .attestationsSection(title: _, items: let items):
            return items.map { $0 }
        }
    }

    init(original: FacetDetailsViewController.ViewModel.SectionModel,
         items: [FacetDetailsViewController.ViewModel.SectionItem]) {
        switch original {
        case let .facetDetailsSection(title: title, items: _):
            self = .facetDetailsSection(title: title, items: items)
        case let .attestationsSection(title: title, items: _):
            self = .attestationsSection(title: title, items: items)
        }
    }
}
