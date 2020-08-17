import React from 'react';
import { useParams } from 'react-router-dom';
const ActiveMembership = () => {
    const { userId } = useParams();

return <div>{userId}</div>;
}
export default ActiveMembership;