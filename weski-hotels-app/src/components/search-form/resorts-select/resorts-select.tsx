import Select from '../../select/select';
import { resorts } from '../../../common/constants';

interface Props {
    onChange: (resortId: number) => void;
    value: number;
}

const ResortsSelect: React.FC<Props> = ({onChange, value}) => {
    const handleChange = (resortId: string) => {
        onChange(Number(resortId));
    };
    
    return (
        <Select
            onChange={handleChange} 
            value={value.toString()} 
            options={resorts.map(resort => ({label: resort.name, value: resort.id.toString()}))} 
        />
    )
}

export default ResortsSelect;