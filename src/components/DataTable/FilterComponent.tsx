import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSearch, ScanSearch, X } from "lucide-react";
/* import styled from "styled-components";

const Input = styled.input.attrs(props => ({
  type: "text",
  size: props?.small ? 5 : undefined
}))`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
`;

const ClearButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`; */


const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
        <div className="flex justify-start pb-[0.1rem] bg-transparent ">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Pesquisar</label>
          <div className="relative self-center">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <ScanSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />              
              </div>
              <input 
                type="text" 
                id="default-search" 
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"             placeholder="pesquisar"         
                value={filterText}
                onChange={onFilter}     
              />
              <button
                 type="button" 
                 className="text-zinc-400 absolute end-2.5 bottom-3.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm"
                 onClick={onClear}
              >
                <X size={24} strokeWidth={1}/>                  
              </button>
          </div>
        </div>

    </>
  );
  
  export default FilterComponent;