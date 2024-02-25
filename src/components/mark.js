import React, {useState} from 'react';
import './mark.css'

function Mark(){
    const [markactive, setmarkactive] = useState(false)

    function markf(){
        if(markactive){
            setmarkactive(false)    
        }else{
            setmarkactive(true)
        }
    }

    return (
        <div className='mark'>
            <div></div>
            <button className={`markBtn ${markactive?"marked":""}`} onClick={markf}>{markactive?"Unmark":"Mark"}</button>
        </div>
    )
}

export default Mark;