//
//  SearchTableViewCell.swift
//  truemuz-ios
//
//  Created by Administrator on 5/1/20.
//  Copyright © 2020 Administrator. All rights reserved.
//

import UIKit

class SearchTableViewCell: UITableViewCell {

    @IBOutlet weak var artistLabel: UILabel!
    @IBOutlet weak var albumLabel: UILabel!
    @IBOutlet weak var yearLabel: UILabel!
    @IBOutlet weak var logoView: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
}

class SearchDataSource: NSObject, UITableViewDataSource {
    var dataSource: [SearchCellViewModel]
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "SearchCell") as? SearchTableViewCell else{
            return SearchTableViewCell()
        }
        
        let row = self.dataSource[indexPath.row]
        
        cell.albumLabel.text = row.album
        cell.artistLabel.text = row.artist
        cell.yearLabel.text = String(row.year)
        cell.logoView?.image = UIImage(named: row.logo)
        return cell
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.dataSource.count
    }
    
    init(source: [SearchCellViewModel]){
        self.dataSource = source
    }
}

class SearchCellViewModel {
    let artist: String
    let album: String
    let year: Int
    let logo: String
    
    init(artist: String, album: String, year: Int, logo: String){
        self.artist = artist
        self.album = album
        self.year = year
        self.logo = logo
    }
}
