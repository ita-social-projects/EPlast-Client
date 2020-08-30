import React,{useState, useEffect} from 'react';
import activeMembershipApi,{ PlastDegree, UserPlastDegree } from '../../../../api/activeMembershipApi';
import { Modal } from 'antd';
import FormAddPlastDegree from './FormAddPlastDegree';
type ModalAddPlastDegreeProps ={
    userId : string;
    visibleModal: boolean;
    setVisibleModal: (visibleModal: boolean) => void;
    handleDeleteUserPlastDegree : (plastDegreeId : number) => void;
    handleAddDegree : () => void;
}
const ModalAddPlastDegree = ({ visibleModal, setVisibleModal, userId, handleDeleteUserPlastDegree,handleAddDegree   }: ModalAddPlastDegreeProps) =>{
    const [availablePlastDegree, setAvailablePlastDegree] = useState<Array<PlastDegree>>([]);
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
},[]);
return <Modal 
        visible={visibleModal}
        footer ={null}>
    <FormAddPlastDegree 
        handleAddDegree = {handleAddDegree}
        handleDeleteUserPlastDegree = {handleDeleteUserPlastDegree}
        userId = {userId}
        setVisibleModal ={setVisibleModal}
        availablePlastDegree ={availablePlastDegree}
        resetAvailablePlastDegree = {fetchData}/>
</Modal>;
};

export default  ModalAddPlastDegree;