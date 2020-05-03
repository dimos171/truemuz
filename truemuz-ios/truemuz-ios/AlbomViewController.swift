//
//  SearchControllerViewController.swift
//  truemuz-ios
//
//  Created by Administrator on 5/1/20.
//  Copyright © 2020 Administrator. All rights reserved.
//

import UIKit

class AlbomViewController: UIViewController {

    @IBOutlet weak var searchBar: UISearchBar!
    @IBOutlet weak var searchTableView: UITableView!
    
    var isSearchBarEmpty: Bool {
      return searchBar.text?.isEmpty ?? true
    }
    
    var dataSource: SearchDataSource?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        dataSource = SearchDataSource(source: getSearchData())
        searchTableView.dataSource = dataSource!
        //searchTableView.isHidden = isSearchBarEmpty
    }
    
    func getSearchData() -> [SearchCellViewModel]{
        var mockSearch = [SearchCellViewModel]()
        mockSearch.append(SearchCellViewModel(artist: "Modernova", album: "Do What You Feel", year: 2018, logo: "Logo-Modernova"))
        mockSearch.append(SearchCellViewModel(artist: "PinlFloyd", album: "Dark Side Of The Moon", year: 1973, logo: "The_Dark_Side_of_the_Moon"))
        mockSearch.append(SearchCellViewModel(artist: "Radiohead", album: "In Rainbows", year: 2007, logo: "In_Rainbows"))
        mockSearch.append(SearchCellViewModel(artist: "Modernova", album: "Do What You Feel", year: 2018, logo: "Logo-Modernova"))
        mockSearch.append(SearchCellViewModel(artist: "PinlFloyd", album: "Dark Side Of The Moon", year: 1973, logo: "The_Dark_Side_of_the_Moon"))
        mockSearch.append(SearchCellViewModel(artist: "Radiohead", album: "In Rainbows", year: 2007, logo: "In_Rainbows"))
        mockSearch.append(SearchCellViewModel(artist: "Modernova", album: "Do What You Feel", year: 2018, logo: "Logo-Modernova"))
        mockSearch.append(SearchCellViewModel(artist: "PinlFloyd", album: "Dark Side Of The Moon", year: 1973, logo: "The_Dark_Side_of_the_Moon"))
        mockSearch.append(SearchCellViewModel(artist: "Radiohead", album: "In Rainbows", year: 2007, logo: "In_Rainbows"))
        mockSearch.append(SearchCellViewModel(artist: "Modernova", album: "Do What You Feel", year: 2018, logo: "Logo-Modernova"))
        mockSearch.append(SearchCellViewModel(artist: "PinlFloyd", album: "Dark Side Of The Moon", year: 1973, logo: "The_Dark_Side_of_the_Moon"))
        mockSearch.append(SearchCellViewModel(artist: "Radiohead", album: "In Rainbows", year: 2007, logo: "In_Rainbows"))
        return mockSearch
    }
}


