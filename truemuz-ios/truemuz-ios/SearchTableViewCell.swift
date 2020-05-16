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
