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
    
    var searchActive : Bool = false
    var filtered:[SearchCellViewModel] = []
    var data: [SearchCellViewModel] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.data = getSearchData()

        self.searchTableView.dataSource = self
        self.searchTableView.delegate = self
        self.searchBar.delegate = self
        self.searchTableView.isHidden = true
        self.searchBar.endEditing(true)
    }
    
    override func viewDidLayoutSubviews(){
        let tableHeight = min(self.searchTableView.contentSize.height, self.searchTableView.frame.size.height)
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

    func searchBarTextDidEndEditing(_ searchBar: UISearchBar) {
        self.searchActive = false;
        self.searchTableView.isHidden = true
    }

    func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
        self.searchActive = false;
    }

    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        self.searchActive = false;
    }

    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        filtered = data.filter({ (cell) -> Bool in
            let tmp: NSString = cell.album as NSString
            let range = tmp.range(of: searchText, options: NSString.CompareOptions.caseInsensitive)
            return range.location != NSNotFound
        })
        if(filtered.count == 0){
            self.searchActive = false;
        } else {
            self.searchTableView.isHidden = false
            self.searchActive = true;
        }
        self.searchTableView.reloadData()
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
        
        let row = self.data[indexPath.row]
        
        cell.albumLabel.text = row.album
        cell.artistLabel.text = row.artist
        cell.yearLabel.text = String(row.year)
        cell.logoView?.image = UIImage(named: row.logo)
        return cell
    }
 
    func getSearchData() -> [SearchCellViewModel]{
        var mockSearch = [SearchCellViewModel]()
        mockSearch.append(SearchCellViewModel(artist: "Modernova", album: "Do What You Feel", year: 2018, logo: "Logo-Modernova"))
        mockSearch.append(SearchCellViewModel(artist: "PinlFloyd", album: "Dark Side Of The Moon", year: 1973, logo: "The_Dark_Side_of_the_Moon"))
        mockSearch.append(SearchCellViewModel(artist: "Radiohead", album: "In Rainbows", year: 2007, logo: "In_Rainbows"))

        return mockSearch
    }
}
