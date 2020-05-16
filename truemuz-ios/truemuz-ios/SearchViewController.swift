//
//  SearchViewController.swift
//  truemuz-ios
//
//  Created by Administrator on 5/10/20.
//  Copyright © 2020 Administrator. All rights reserved.
//

import UIKit

class SearchViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, UISearchBarDelegate {

    @IBOutlet weak var searchBar: UISearchBar!
    @IBOutlet weak var searchTableView: UITableView!
    
    let cellHeight : CGFloat = 70
    var tableFrameHeight: CGFloat = 0
    var searchActive : Bool = false
    var filtered: [SearchCellViewModel] = []
    var data: [SearchCellViewModel] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.data = getSearchData()
        
        self.tableFrameHeight = self.searchTableView.frame.size.height
        self.searchTableView.dataSource = self
        self.searchTableView.delegate = self
        self.searchBar.delegate = self
        self.searchTableView.isHidden = true
        self.searchBar.showsCancelButton = true
        view.isOpaque = false
    }
    
    override func viewDidLayoutSubviews(){
        
        let tableHeight = min(cellHeight * CGFloat(self.filtered.count) + 1, self.tableFrameHeight)
        
        self.searchTableView.frame = CGRect(x: self.searchTableView.frame.origin.x,
                                             y: self.searchTableView.frame.origin.y,
                                             width: self.searchTableView.frame.size.width,
                                             height: tableHeight)
        self.searchTableView.reloadData()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func searchBarTextDidBeginEditing(_ searchBar: UISearchBar) {
        self.searchActive = true;
    }

    func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
        self.searchActive = false;
        self.searchTableView.isHidden = true
        self.searchBar.text = nil
    }

    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        self.filtered = data.filter{ $0.artist.contains(searchText) || $0.album.contains(searchText) }
        if(filtered.count == 0){
            self.searchActive = false;
            self.searchTableView.isHidden = true
        } else {
            self.searchActive = true;
            self.searchTableView.isHidden = false

        }
        viewDidLayoutSubviews()
    }

    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if(self.searchActive) {
            return self.filtered.count
        }
        return self.data.count;
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "SearchCell") as? SearchTableViewCell else{
            return SearchTableViewCell()
        }
        
        let row: SearchCellViewModel
        if(self.searchActive) {
            row = self.filtered[indexPath.row]
        }
        else {
            row = self.data[indexPath.row]
        }
        
        cell.albumLabel.text = row.album
        cell.artistLabel.text = row.artist
        cell.yearLabel.text = String(row.year)
        cell.logoView?.image = UIImage(named: row.logo)
        //cell.preservesSuperviewLayoutMargins = false
        cell.separatorInset = UIEdgeInsets.zero
       // cell.layoutMargins = UIEdgeInsets.zero
        return cell
    }
 
    func getSearchData() -> [SearchCellViewModel]{
        var mockSearch = [SearchCellViewModel]()
        mockSearch.append(SearchCellViewModel(artist: "Modernova", album: "Do What You Feel", year: 2018, logo: "Logo-Modernova"))
        mockSearch.append(SearchCellViewModel(artist: "PinkFloyd", album: "Dark Side Of The Moon", year: 1973, logo: "The_Dark_Side_of_the_Moon"))
        mockSearch.append(SearchCellViewModel(artist: "Radiohead", album: "In Rainbows", year: 2007, logo: "In_Rainbows"))
        mockSearch.append(SearchCellViewModel(artist: "Modernova", album: "Do What You Feel", year: 2018, logo: "Logo-Modernova"))
        mockSearch.append(SearchCellViewModel(artist: "PinkFloyd", album: "Dark Side Of The Moon", year: 1973, logo: "The_Dark_Side_of_the_Moon"))
        mockSearch.append(SearchCellViewModel(artist: "Radiohead", album: "In Rainbows", year: 2007, logo: "In_Rainbows"))
        mockSearch.append(SearchCellViewModel(artist: "Modernova", album: "Do What You Feel", year: 2018, logo: "Logo-Modernova"))
        mockSearch.append(SearchCellViewModel(artist: "PinkFloyd", album: "Dark Side Of The Moon", year: 1973, logo: "The_Dark_Side_of_the_Moon"))
        mockSearch.append(SearchCellViewModel(artist: "Radiohead", album: "In Rainbows", year: 2007, logo: "In_Rainbows"))
        mockSearch.append(SearchCellViewModel(artist: "Modernova", album: "Do What You Feel", year: 2018, logo: "Logo-Modernova"))
        mockSearch.append(SearchCellViewModel(artist: "PinkFloyd", album: "Dark Side Of The Moon", year: 1973, logo: "The_Dark_Side_of_the_Moon"))
        mockSearch.append(SearchCellViewModel(artist: "Radiohead", album: "In Rainbows", year: 2007, logo: "In_Rainbows"))
        mockSearch.append(SearchCellViewModel(artist: "Modernova", album: "Do What You Feel", year: 2018, logo: "Logo-Modernova"))
        mockSearch.append(SearchCellViewModel(artist: "Modernova", album: "Do What You Feel", year: 2018, logo: "Logo-Modernova"))

        return mockSearch
    }
}
