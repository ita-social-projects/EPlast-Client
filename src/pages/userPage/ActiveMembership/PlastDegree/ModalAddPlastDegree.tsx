import React,{useState, useEffect} from 'react';
import activeMembershipApi,{ PlastDegree, UserPlastDegree } from '../../../../api/activeMembershipApi';
import { Modal } from 'antd';
import FormAddPlastDegree from './FormAddPlastDegree';
type ModalAddPlastDegreeProps ={
    userId : string;
    visibleModal: boolean;
    setVisibleModal: (visibleModal: boolean) => void;
    handleAddDegree : () => void;
}
const ModalAddPlastDegree = ({ visibleModal, setVisibleModal, userId, handleAddDegree   }: ModalAddPlastDegreeProps) =>{
    const [availablePlastDegree, setAvailablePlastDegree] = useState<Array<PlastDegree>>([]);
    const handleCancel = () => setVisibleModal(false);
    const getAvailablePlastDegree = (allDegrees : Array<PlastDegree>, userPlastDegrees : Array<UserPlastDegree>): Array<PlastDegree>=> {
        
        const aupd : Array<PlastDegree> = [];
        allDegrees.forEach(d =>{
            let isIncludes : boolean = false;
          userPlastDegrees.forEach(upd => {
              if(upd.plastDegree.id === d.id){
                  isIncludes = !isIncludes;
                return;
              }
          });
          if(!isIncludes)aupd.push(d);
        });
       return aupd;
    }
    const fetchData = async () =>{
        await activeMembershipApi.getAllPlastDegrees().then( async response =>{
            await activeMembershipApi.getUserPlastDegrees(userId).then(res =>{
                setAvailablePlastDegree(getAvailablePlastDegree(response, res));
            }
            )
        })
    }
useEffect(()=>{
    fetchData();
},[,handleCancel]);
return <Modal 
        visible={visibleModal}
        onCancel ={handleCancel}
        title = "Надання пластового ступеня"
        footer ={null}>
    <FormAddPlastDegree 
        handleAddDegree = {handleAddDegree}
        userId = {userId}
        setVisibleModal ={setVisibleModal}
        availablePlastDegree ={availablePlastDegree}
        resetAvailablePlastDegree = {fetchData}/>
        
</Modal>;
};

export default  ModalAddPlastDegree;