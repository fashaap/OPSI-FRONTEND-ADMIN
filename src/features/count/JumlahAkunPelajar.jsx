import { accountPelajar, Kelas } from "../../data/data";

const JumlahAkunUser = (kelas) => {
  let account = accountPelajar.filter((item) => item.kelas === kelas);
  // console.log(account);
  const totalAccount = account.length; 

  const totalKelas = Kelas.reduce((acc, item) => acc + item.total, 0); 

  const total = totalAccount + totalKelas; 

  console.log(total);
  return total; 
};

export default JumlahAkunUser;
