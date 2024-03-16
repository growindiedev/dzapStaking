'use client';

import React, { use, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import {
  useAccount,
  useBlockNumber,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
  useWatchBlocks,
} from 'wagmi';
import { contractAddress } from '@/abi/config';
import { abi } from '@/abi/abi';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

const Main = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      tokenAmount: 0,
    },
  });

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const {
    data: getDetailsData,
    queryKey: getDetailsDataQueryKey,
    isSuccess: isGetDetailsDataSuccess,
    isError: isGetDetailsDataError,
    refetch: refetchGetDetails,
  } = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getDetails',
  });

  const {
    data: getStakerInfoData,
    queryKey: getStakerInfoQueryKey,
    isSuccess: isGetStakerInfoDataSuccess,
    isError: isGetStakerInfoDataError,
    refetch: refetchGetStakerInfo,
  } = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getStakerInfo',
    args: [address as '0xString'],
  });

  useWatchBlocks({
    blockTag: 'earliest',
    onBlock(block) {
      console.log('New block', block.number);
      queryClient.invalidateQueries({
        //queryKey: [getStakerInfoQueryKey, getDetailsDataQueryKey],
        queryKey: getStakerInfoQueryKey,
      });
    },
  });

  const { toast } = useToast();

  return (
    <div className="flex  items-center justify-center h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>DZAP MT3 Staking</CardTitle>
          <CardDescription>
            Stake your MT3 tokens and earn rewards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 gap-2">
                <Label htmlFor="amount">MT3 tokens amount</Label>
                <Input
                  type="number"
                  id="tokenAmount"
                  {...register('tokenAmount')}
                  placeholder="amount of tokens you want to stake"
                />
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Current claimable tokens</Badge>
                <Badge>
                  {getStakerInfoData
                    ? Number(getStakerInfoData[2])
                    : 'not available'}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Staked Amount</Badge>
                <Badge variant="secondary">
                  {getStakerInfoData
                    ? Number(getStakerInfoData[1])
                    : 'not available'}
                </Badge>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={handleSubmit(async () => {
              await writeContractAsync(
                {
                  address: contractAddress,
                  abi: abi,
                  functionName: 'claimRewards',
                },
                {
                  onSuccess: () => {
                    toast({
                      description: 'Rewards claimed successfully',
                    });
                  },
                  onError: (error) => {
                    toast({
                      description: error.message,
                      variant: 'destructive',
                    });
                  },
                },
              );
            })}
          >
            Claim rewards
          </Button>
          <div className="flex w-full gap-3">
            <Button
              onClick={handleSubmit(async (data) => {
                await writeContractAsync(
                  {
                    address: contractAddress,
                    abi: abi,
                    functionName: 'stake',
                    args: [BigInt(data.tokenAmount)],
                  },
                  {
                    onSuccess: () => {
                      toast({
                        description: 'Staked successfully',
                      });
                    },
                    onError: (error) => {
                      toast({
                        description: error.message,
                        variant: 'destructive',
                      });
                    },
                  },
                );
                reset({ tokenAmount: 0 });
              })}
              variant="secondary"
              className="w-1/2"
            >
              Stake
            </Button>
            <Button
              variant="secondary"
              className="w-1/2"
              onClick={handleSubmit(async (data) => {
                await writeContractAsync(
                  {
                    address: contractAddress,
                    abi: abi,
                    functionName: 'unstake',
                  },
                  {
                    onSuccess: () => {
                      toast({
                        description: 'Unstaked successfully',
                      });
                    },
                    onError: (error) => {
                      toast({
                        description: error.message,
                        variant: 'destructive',
                      });
                    },
                  },
                );
              })}
            >
              Unstake
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Main;
