const stars = (n: number) => '*'.repeat(n);
const barrier = ()=> console.log(stars(80));

const errorMsg = ({ msg, error }: { msg: string; error: any }) => {
  barrier();
  console.log(stars(35) + ' <% ERROR %> ' + msg.toUpperCase());
  barrier();
  console.log(error);
  barrier();
  console.log(stars(38) + ' <% END %> ' + msg.toUpperCase() + ' <% END %>');
  barrier();
};

export default errorMsg;
