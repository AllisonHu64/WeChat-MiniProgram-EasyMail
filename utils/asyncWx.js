/*
 * promise 形式 getSetting
 */

export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }

        });
    }

    )
}


/*
 * promise 形式 chooseAddress
 */

export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result)=>{
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }

        });
    }

    )
}

/*
 * promise 形式 openSetting
 */

export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }

        });
    })
}

/*
 * promise 形式 showModal
 * @param {object} param0 参数
 */

export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            content: content,
            title:"Alert",
            cancelText: "No",
            confirmText: "Yes",
    
            success: (res) => {
              resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
          });
    })
}