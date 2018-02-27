//  Copyright © 2018 Koninklijke Philips Nederland N.V. All rights reserved.

import UIKit
import RxSwift
import RxCocoa
import RxDataSources

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

        self.tableView.dataSource = nil

        let dataSource = RxTableViewSectionedReloadDataSource<ViewModel.SectionModel>(
            configureCell: { dataSource, table, indexPath, _ in
                switch dataSource[indexPath] {
                case let .facetDetailItem(title, detail):
                    let cell = table.dequeueReusableCell(withIdentifier: "Normal", for: indexPath)
                    cell.textLabel?.text = title
                    cell.detailTextLabel?.text = detail
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
            case attributionsSection(title: String, items: [SectionItem])
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
        case .attributionsSection(title: let title, items: _): return title
        }
    }

    var items: [FacetDetailsViewController.ViewModel.SectionItem] {
        switch self {
        case .facetDetailsSection(title: _, items: let items):
            return items.map { $0 }
        case .attributionsSection(title: _, items: let items):
            return items.map { $0 }
        }
    }

    init(original: FacetDetailsViewController.ViewModel.SectionModel,
         items: [FacetDetailsViewController.ViewModel.SectionItem]) {
        switch original {
        case let .facetDetailsSection(title: title, items: _):
            self = .facetDetailsSection(title: title, items: items)
        case let .attributionsSection(title: title, items: _):
            self = .attributionsSection(title: title, items: items)
        }
    }
}
