//
//  ViewController.swift
//  truemuz-ios
//
//  Created by Administrator on 5/1/20.
//  Copyright © 2020 Administrator. All rights reserved.
//

import UIKit

class PlayerViewController: UIViewController {

    @IBOutlet weak var containerViewTopConstraint: NSLayoutConstraint!
    
    @IBOutlet weak var containerView: UIView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        adjustContainerTopConstraint()
    }
    
    func adjustContainerTopConstraint(){
        if UIDevice().userInterfaceIdiom == .phone {
        switch UIScreen.main.nativeBounds.height {
            case 1136:
                //"iPhone 5 or 5S or 5C"
                containerViewTopConstraint.constant = 0
            case 1334:
                //"iPhone 6/6S/7/8"
                containerViewTopConstraint.constant = 0
            case 1920, 2208:
                //"iPhone 6+/6S+/7+/8+"
                containerViewTopConstraint.constant = 0
            case 2436:
                //"iPhone X/XS/11 Pro"
                containerViewTopConstraint.constant = 33
            case 2688:
                //"iPhone XS Max/11 Pro Max"
                containerViewTopConstraint.constant = 33
            case 1792:
                //"iPhone XR/ 11"
                containerViewTopConstraint.constant = 33
            default:
                containerViewTopConstraint.constant = 33
            }
        }
        
        containerView.layoutIfNeeded()
    }
}

